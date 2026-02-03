import { Html, Head, Body, Container, Text, Link, Hr } from "@react-email/components";

type ProjectAccessEmailProps = {
  projectName?: string;
  accessLink: string;
};

const ProjectAccessEmail = ({
  projectName = "Project",
  accessLink,
}: ProjectAccessEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        {/* Email Client Card */}
         
          {/* Email Content */}
          <div style={styles.content}>
            <Text style={styles.text}>
              On behalf of <strong>The Kaleidoscope Project</strong>, thank you for
              using our budgeting tool for responsible AI deployments.
            </Text>

            <Text style={styles.text}>
              Here is the secure access link for your {projectName ? "Project" : ""} <strong>{projectName ? projectName : "Project"}</strong>.
            </Text>

            <Link href={accessLink} style={styles.button}>
              Open Project
            </Link>

            <Hr style={styles.hr} />

            <Text style={styles.warning}>
              ⚠️ <strong>Important Note on Sharing</strong><br />
              This is a live edit link. Anyone with this URL can adjust the budget
              and strategy settings.
            </Text>

            <Text style={styles.text}>
              • <strong>To Collaborate:</strong> Share this email with your team.<br />
              • <strong>To Report:</strong> Use the “Download PDF” button inside the tool.
            </Text>

            <Text style={styles.text}>
              <strong>Our Privacy Promise:</strong> We do not share this link without
              your explicit permission.
            </Text>

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

            <Text style={styles.signature}>
              <strong>Addie Achan</strong><br />
              Founder, The Kaleidoscope Project<br/>
              projectkaleidoscope.org
            </Text>
          </div>
      </Body>
    </Html>
  );
};

export default ProjectAccessEmail;

const styles: { [key: string]: React.CSSProperties } = {
  body: {
    backgroundColor: "#f6f9fc",
    fontFamily: "Arial, sans-serif",
    padding: "16px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
    maxWidth: "600px",
    margin: "0 auto",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "linear-gradient(to right, #f9fafb, #f3f4f6)",
    padding: "16px",
    borderBottom: "1px solid #e5e7eb",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#22c55e",
  },
  headerText: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#111827",
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    color: "#6b7280",
  },
  emailInfo: {
    padding: "0 16px 16px 16px",
  },
  emailRow: {
    backgroundColor: "#fff",
    borderRadius: "6px",
    padding: "8px 12px",
    marginBottom: "6px",
    fontSize: "14px",
  },
  label: {
    color: "#6b7280",
  },
  info: {
    fontWeight: 500,
    color: "#111827",
  },
  content: {
    background: "linear-gradient(to bottom, #f9fafb, #fff)",
    padding: "24px 16px",
  },
  text: {
    fontSize: "14px",
    color: "#111827",
    lineHeight: 1.6,
    marginBottom: "12px",
  },
  warning: {
    fontSize: "13px",
    color: "#b45309",
    backgroundColor: "#fffbeb",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "12px",
  },
  button: {
    display: "inline-block",
    padding: "12px 24px",
    backgroundColor: "#465fff",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    margin: "16px 0",
    textAlign: "center",
  },
  hr: {
    margin: "24px 0",
    borderColor: "#e5e7eb",
  },
  link: {
    color: "#465fff",
    textDecoration: "underline",
  },
  signature: {
    fontSize: "13px",
    color: "#6b7280",
    marginTop: "24px",
  },
};
