import 'package:flutter/cupertino.dart';

class ReadBookPage extends StatefulWidget {
  final String bookId;

  const ReadBookPage({super.key, required this.bookId});

  @override
  State<ReadBookPage> createState() => _ReadBookPageState();
}

class _ReadBookPageState extends State<ReadBookPage> {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(20),
      child: Row(
        children: [
          Container(),
          Column(
            children: [],
          )
        ],
      ),
    );
  }
}
