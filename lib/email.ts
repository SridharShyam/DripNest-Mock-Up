import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const sendRestockEmail = async (email: string, product: any, variant: any) => {
  console.log('--- EMAIL SIMULATION (RE-STOCK) ---');
  console.log(`To: ${email}`);
  console.log(`Subject: Back in Stock: ${product.name}`);
  console.log(`Body: Great news! The ${product.name} in ${variant.colour} / ${variant.size} is back in stock.`);
  console.log('-----------------------------------');

  if (resend) {
    try {
      await resend.emails.send({
        from: 'DripNest <onboarding@resend.dev>',
        to: email,
        subject: `Back in Stock: ${product.name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h1 style="color: #7b62c4;">Back in Stock!</h1>
            <p>Hey there,</p>
            <p>You asked us to notify you when the <strong>${product.name}</strong> was back.</p>
            <div style="display: flex; gap: 20px; margin: 20px 0;">
              <div>
                <p><strong>Variant:</strong> ${variant.colour} / ${variant.size}</p>
                <p><strong>Price:</strong> $${product.price}</p>
              </div>
            </div>
            <a href="${process.env.NEXTAUTH_URL}/product/${product.slug}" 
               style="display: inline-block; background-color: #7b62c4; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px;">
               Shop Now
            </a>
            <p style="margin-top: 30px; font-size: 12px; color: #888;">You're receiving this because you signed up for a restock alert on DripNest.</p>
          </div>
        `
      });
    } catch (error) {
      console.error('Resend error:', error);
    }
  }
};

export const sendOrderUpdateEmail = async (email: string, order: any, event: any) => {
  console.log('--- EMAIL SIMULATION (ORDER UPDATE) ---');
  console.log(`To: ${email}`);
  console.log(`Subject: Order Update: #DN-${order.id.slice(0, 8).toUpperCase()}`);
  console.log(`Body: Your order is now: ${event.status}. ${event.description}`);
  console.log('---------------------------------------');

  if (resend) {
    try {
      await resend.emails.send({
        from: 'DripNest <onboarding@resend.dev>',
        to: email,
        subject: `Order Update: #DN-${order.id.slice(0, 8).toUpperCase()}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h1 style="color: #7b62c4;">Order Update</h1>
            <p>Hey there,</p>
            <p>Your order <strong>#DN-${order.id.slice(0, 8).toUpperCase()}</strong> has a new update:</p>
            <div style="background-color: #faf9f7; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0;">${event.title}</h3>
              <p>${event.description}</p>
              ${event.location ? `<p style="font-size: 12px; color: #888;">Location: ${event.location}</p>` : ''}
            </div>
            <a href="${process.env.NEXTAUTH_URL}/track?orderId=${order.id}&email=${email}" 
               style="display: inline-block; background-color: #7b62c4; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px;">
               Track Order
            </a>
          </div>
        `
      });
    } catch (error) {
      console.error('Resend error:', error);
    }
  }
};
