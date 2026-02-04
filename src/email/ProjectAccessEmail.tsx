import { Html, Head, Body, Text, Link, Hr, Container, Section } from "@react-email/components";

type ProjectAccessEmailProps = {
  projectName?: string;
  accessLink: string;
  userName?: string;
};

const KaleidoscopeEmail = ({
  projectName = "Project",
  accessLink,
  userName = "User",
}: ProjectAccessEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
       
          {/* Main Content */}
          <Section style={styles.content}>
            <Text style={styles.greeting}>
              Hi {userName},
            </Text>
            
            <Text style={styles.text}>
              On behalf of <strong>The Kaleidoscope Project</strong>, we would like to thank you for
              using our budgeting tool for responsible AI deployments.
            </Text>

            <Text style={styles.text}>
              Here is the secure access link for your {projectName ? "Project" : ""} <strong>{projectName ? projectName : "Project"}</strong>.
            </Text>

            {/* CTA Button */}
            <div style={styles.buttonContainer}>
              <Link href={accessLink} style={styles.button}>
                Access Your Project
              </Link>
            </div>

            <Hr style={styles.hr} />

            {/* Warning Box */}
            <Section style={styles.warningBox}>
              <Text style={styles.warningTitle}>
                ⚠️ <strong>Important Note on Sharing</strong>
              </Text>
              <Text style={styles.warningText}>
                This is a live edit link. Anyone with this URL can adjust the budget
                and strategy settings.
              </Text>
              <Text style={styles.text}>
                • <strong>To Collaborate:</strong> Share this email with your team.<br />
                • <strong>To Report:</strong>  If you need a static, read-only view, please use the "Download PDF" button 
inside the tool.
              </Text>
            </Section>

            {/* Privacy Promise */}
            <Section style={styles.privacyBox}>
              <Text style={styles.privacyText}>
                🔒 <strong>Our Privacy Promise:</strong> We do not share this link without
                your explicit permission.
              </Text>
            </Section>

            {/* Mission Statement */}
            <Text style={styles.text}>
              Our mission is to equip changemakers with the resources to navigate
              the AI age. Check out{" "}
              <Link href="https://projectkaleidoscope.org" style={styles.link}>
                projectkaleidoscope.org
              </Link>{" "}
              for more.
            </Text>

            <Text style={styles.text}>
              Please reach out with any questions or feedback so we can improve our tool!
            </Text>

            <Hr style={styles.divider} />

            {/* Signature */}
            <Text style={styles.signature}>
              <strong>Addie Achan</strong><br />
              Founder, The Kaleidoscope Project<br/>
              <Link href="https://projectkaleidoscope.org" style={styles.signatureLink}>
                projectkaleidoscope.org
              </Link>
            </Text>

           
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default KaleidoscopeEmail;

const styles: { [key: string]: React.CSSProperties } = {
  body: {
    backgroundColor: "#f6f9fc",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    padding: "40px 20px",
  },
  container: {
    width: "100%",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "0",
    overflow: "hidden",
    maxWidth: "700px",
  },
  header: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    padding: "32px 24px",
    textAlign: "center",
  },
  brandName: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#ffffff",
    margin: "0 0 8px 0",
    lineHeight: "1.2",
  },
  brandTagline: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.95)",
    margin: "0",
    lineHeight: "1.2",
  },
  content: {
    padding: "40px 32px",
  },
  greeting: {
    fontSize: "18px",
    color: "#1a202c",
    fontWeight: "600",
    margin: "0 0 20px 0",
  },
  text: {
    fontSize: "15px",
    color: "#2d3748",
    lineHeight: "1.7",
    margin: "0 0 16px 0",
  },
  buttonContainer: {
    textAlign: "center",
    margin: "32px 0",
  },
  button: {
    display: "inline-block",
    padding: "14px 32px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#ffffff",
    textDecoration: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
  },
  hr: {
    margin: "32px 0",
    borderColor: "#e2e8f0",
  },
  warningBox: {
    backgroundColor: "#fffbeb",
    border: "1px solid #fcd34d",
    borderRadius: "8px",
    padding: "20px",
    margin: "0 0 24px 0",
  },
  warningTitle: {
    fontSize: "15px",
    color: "#b45309",
    margin: "0 0 12px 0",
  },
  warningText: {
    fontSize: "14px",
    color: "#92400e",
    margin: "0 0 12px 0",
    lineHeight: "1.6",
  },
  privacyBox: {
    backgroundColor: "#eff6ff",
    border: "1px solid #93c5fd",
    borderRadius: "8px",
    padding: "16px 20px",
    margin: "0 0 24px 0",
  },
  privacyText: {
    fontSize: "14px",
    color: "#1e40af",
    margin: "0",
    lineHeight: "1.6",
  },
  divider: {
    margin: "32px 0 24px 0",
    borderColor: "#e2e8f0",
  },
  link: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "600",
  },
  signature: {
    fontSize: "14px",
    color: "#4a5568",
    margin: "0 0 24px 0",
    lineHeight: "1.6",
  },
  signatureLink: {
    fontSize: "14px",
    color: "#667eea",
    textDecoration: "none",
  },
  footer: {
    fontSize: "12px",
    color: "#a0aec0",
    textAlign: "center",
    margin: "0",
    paddingTop: "20px",
    borderTop: "1px solid #e2e8f0",
  },
};