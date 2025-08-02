import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import prisma from '@/lib/db'


export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET
  
  // In development, allow webhook to work without verification
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  if (!SIGNING_SECRET && !isDevelopment) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET || 'dummy-secret')

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Verify payload with headers (skip in development)
  let evt: WebhookEvent
  
  if (isDevelopment) {
    // In development, just parse the payload without verification
    evt = payload as WebhookEvent
  } else {
    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent
    } catch (err) {
      console.error('Error: Could not verify webhook:', err)
      // Log more details about the error
      if (err instanceof Error) {
        console.error('Webhook verification error details:', err.message)
      }
      return new Response('Error: Verification error', {
        status: 400,
      })
    }
  }


  if(evt.type === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url, username, primary_email_address_id } = evt.data;
    
    // Log the webhook data for debugging
    console.log('Webhook data:', JSON.stringify(evt.data, null, 2));
    
    // Handle case where email_addresses is empty but we have primary_email_address_id
    if (!email_addresses || email_addresses.length === 0) {
      console.log('No email addresses in webhook, but user has primary_email_address_id:', primary_email_address_id);
      
      // For now, create user with a placeholder email that can be updated later
      // You might want to fetch the email from Clerk API or handle this differently
      const placeholderEmail = `user_${id}@placeholder.com`;
      
      try {
        const newUser = await prisma.user.create({
          data: {
            clerkId: id,
            email: placeholderEmail,
            firstName: first_name || '',
            lastName: last_name || '',
            avatar: image_url,
            username: username || `user_${id}`,
          }
        });
        console.log('User created successfully with placeholder email:', newUser.id);
        return new Response(JSON.stringify(newUser), {
          status: 201,
        });
      } catch(error) {
        console.error('Error: Failed to store event in the database:', error);
        return new Response('Error: Failed to store event in the database', {
          status: 500,
        });
      }
    }
    
    const primaryEmail = email_addresses.find(email => email.id === primary_email_address_id) || email_addresses[0];
    
    try {
      const newUser = await prisma.user.create({
        data: {
          clerkId: id,
          email: primaryEmail.email_address,
          firstName: first_name || '',
          lastName: last_name || '',
          avatar: image_url,
          username: username || primaryEmail.email_address.split('@')[0],
        }
      });
      console.log('User created successfully:', newUser.id);
      return new Response(JSON.stringify(newUser), {
        status: 201,
      });
    } catch(error) {
      console.error('Error: Failed to store event in the database:', error);
      return new Response('Error: Failed to store event in the database', {
        status: 500,
      });
    }
  }

  if(evt.type === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url, primary_email_address_id } = evt.data;
    
    // Handle case where email_addresses is empty
    if (!email_addresses || email_addresses.length === 0) {
      console.log('No email addresses in update webhook for user:', id);
      
      try {
        const updatedUser = await prisma.user.update({
          where: { clerkId: id },
          data: {
            firstName: first_name || '',
            lastName: last_name || '',
            avatar: image_url,
          }
        });
        console.log('User updated successfully (without email):', updatedUser.id);
        return new Response(JSON.stringify(updatedUser), {
          status: 200,
        });
      } catch(error) {
        console.error('Error: Failed to update user in the database:', error);
        return new Response('Error: Failed to update user in the database', {
          status: 500,
        });
      }
    }
    
    const primaryEmail = email_addresses.find(email => email.id === primary_email_address_id) || email_addresses[0];
    
    try {
      const updatedUser = await prisma.user.update({
        where: { clerkId: id },
        data: {
          email: primaryEmail.email_address,
          firstName: first_name || '',
          lastName: last_name || '',
          avatar: image_url,
        }
      });
      console.log('User updated successfully:', updatedUser.id);
      return new Response(JSON.stringify(updatedUser), {
        status: 200,
      });
    } catch(error) {
      console.error('Error: Failed to update user in the database:', error);
      return new Response('Error: Failed to update user in the database', {
        status: 500,
      });
    }
  }

  if(evt.type === 'user.deleted') {
    const { id } = evt.data
    try {
      await prisma.user.delete({
        where: { clerkId: id }
      });
      return new Response('User deleted successfully', {
        status: 200,
      })
    } catch(error) {
      console.error('Error: Failed to delete user from the database:', error)
      return new Response('Error: Failed to delete user from the database', {
        status: 500,
      });
    }
  }

  return new Response('Webhook received', { status: 200 })
} 