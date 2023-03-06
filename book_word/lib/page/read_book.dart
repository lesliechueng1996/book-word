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
  final PdfViewerController _pdfViewerController = PdfViewerController();
  OverlayEntry? _overlayEntry;

  void _showContextMenu(
      BuildContext context, PdfTextSelectionChangedDetails details) {
    final OverlayState overlayState = Overlay.of(context);
    _overlayEntry = OverlayEntry(
      builder: (context) => Positioned(
        top: details.globalSelectedRegion!.center.dy - 85,
        left: details.globalSelectedRegion!.bottomLeft.dx,
        child: CupertinoButton(
            onPressed: () {
              print(details.selectedText);
              _pdfViewerController.clearSelection();
            },
            color: CupertinoColors.label,
            child: const Text('翻译', style: TextStyle(fontSize: 13))),
      ),
    );
    overlayState.insert(_overlayEntry!);
  }

  @override
  Widget build(BuildContext context) {
    return CupertinoPageScaffold(
      navigationBar: CupertinoNavigationBar(
        leading: GestureDetector(
          onTap: () {
            Navigator.pop(context);
          },
          child: const Text('返回'),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            Expanded(
              flex: 4,
              child: Container(
                  child: SfPdfViewer.file(
                File(widget.filePath),
                controller: _pdfViewerController,
                onTextSelectionChanged:
                    (PdfTextSelectionChangedDetails details) {
                  if (details.selectedText == null && _overlayEntry != null) {
                    _overlayEntry!.remove();
                    _overlayEntry = null;
                  } else if (details.selectedText != null &&
                      _overlayEntry == null) {
                    _showContextMenu(context, details);
                  }
                },
              )),
            ),
            Expanded(
              flex: 1,
              child: Column(
                children: [
                  Expanded(child: Container()),
                  Expanded(child: ListView()),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    _pdfViewerController.dispose();
    super.dispose();
  }
}
