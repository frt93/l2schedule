export default function({ store, redirect, route }) {
  // If the user is not authenticated
  if (!store.state.auth.user) {
    return redirect(`/auth/signin`);
  }
}
