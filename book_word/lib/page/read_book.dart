import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:syncfusion_flutter_pdfviewer/pdfviewer.dart';

class ReadBookPage extends StatefulWidget {
  final String bookId;
  final String filePath;

  const ReadBookPage({super.key, required this.bookId, required this.filePath});

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
          Container(child: SfPdfViewer.file(File(widget.filePath))),
          Column(
            children: [
              Expanded(child: Container()),
              Expanded(child: ListView()),
            ],
          )
        ],
      ),
    );
  }
}
