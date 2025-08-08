import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWorkflowSubmittedEmail = async ({
  developerEmail,
  developerName,
  workflowName,
}: {
  developerEmail: string;
  developerName: string;
  workflowName: string;
}) => {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: developerEmail,
      subject: "Workflow Submitted Successfully",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Workflow Submitted</h2>
          <p>Hi ${developerName},</p>
          <p>Your workflow "<strong>${workflowName}</strong>" has been submitted successfully and is now under review.</p>
          <p>We'll notify you once the review is complete.</p>
          <p>Best regards,<br>The WorkflowHub Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send workflow submitted email:", error);
  }
};

export const sendWorkflowApprovedEmail = async ({
  developerEmail,
  developerName,
  workflowName,
}: {
  developerEmail: string;
  developerName: string;
  workflowName: string;
}) => {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: developerEmail,
      subject: "Workflow Approved!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22c55e;">🎉 Workflow Approved!</h2>
          <p>Hi ${developerName},</p>
          <p>Great news! Your workflow "<strong>${workflowName}</strong>" has been approved and is now live on the marketplace.</p>
          <p>You can now start earning from sales of your workflow.</p>
          <p>Best regards,<br>The WorkflowHub Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send workflow approved email:", error);
  }
};

export const sendWorkflowRejectedEmail = async ({
  developerEmail,
  developerName,
  workflowName,
  reason,
}: {
  developerEmail: string;
  developerName: string;
  workflowName: string;
  reason?: string;
}) => {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: developerEmail,
      subject: "Workflow Review Update",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Workflow Review Update</h2>
          <p>Hi ${developerName},</p>
          <p>Your workflow "<strong>${workflowName}</strong>" was not approved at this time.</p>
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
          <p>Please review our guidelines and feel free to submit an updated version.</p>
          <p>Best regards,<br>The WorkflowHub Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send workflow rejected email:", error);
  }
};

export const sendPurchaseConfirmationEmail = async ({
  buyerEmail,
  buyerName,
  workflowName,
  amount,
}: {
  buyerEmail: string;
  buyerName: string;
  workflowName: string;
  amount: number;
}) => {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: buyerEmail,
      subject: "Purchase Confirmation - WorkflowHub",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Purchase Confirmation</h2>
          <p>Hi ${buyerName},</p>
          <p>Thank you for your purchase! Your payment of <strong>$${amount.toFixed(2)}</strong> for "<strong>${workflowName}</strong>" has been processed successfully.</p>
          <p>You can now download your workflow from your dashboard.</p>
          <p>Best regards,<br>The WorkflowHub Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send purchase confirmation email:", error);
  }
};
