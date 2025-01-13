import AntdLoginForm from "./antdLoginForm.client";

export const metadata = {
  title: "Log In | Xync Board",
  description: "",
};

// TODO: Form validation

export default function LoginPage() {
  return (
    <main
      className="bg-gradient-to-br from-teal-700 to-teal-950 min-h-screen flex flex-1 flex-col justify-center p-6 
                 lg:p-8"
    >
      <AntdLoginForm />
    </main>
  );
}
