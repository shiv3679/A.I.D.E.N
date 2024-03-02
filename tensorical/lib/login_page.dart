import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _auth = FirebaseAuth.instance;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Login')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _emailController,
              decoration: InputDecoration(labelText: 'Email'),
            ),
            TextField(
              controller: _passwordController,
              decoration: InputDecoration(labelText: 'Password'),
              obscureText: true,
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: _login,
              child: Text('Login'),
            ),
            TextButton(
              onPressed: _signUp,
              child: Text('Sign up'),
            )
          ],
        ),
      ),
    );
  }

  void _login() async {
    try {
      final user = await _auth.signInWithEmailAndPassword(
        email: _emailController.text.trim(),
        password: _passwordController.text.trim(),
      );
      if (user != null) {
        // Navigate to the home screen
        Navigator.pushReplacementNamed(context, '/home');
      }
    } catch (e) {
      // Show error message
      print(e); // Consider using a dialog or snackbar to show errors
    }
  }

  void _signUp() async {
    try {
      final newUser = await _auth.createUserWithEmailAndPassword(
        email: _emailController.text.trim(),
        password: _passwordController.text.trim(),
      );
      if (newUser != null) {
        // Navigate to the home screen
        Navigator.pushReplacementNamed(context, '/home');
      }
    } catch (e) {
      // Show error message
      print(e); // Consider using a dialog or snackbar to show errors
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}
