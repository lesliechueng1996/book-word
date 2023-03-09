import 'package:book_word/model/word_model.dart';
import 'package:flutter/cupertino.dart';

import '../api/word_api.dart';

class WordList extends StatefulWidget {
  final List<WordModel> wordList;

  const WordList({super.key, required this.wordList});

  @override
  State<WordList> createState() => _WordListState();
}

class _WordListState extends State<WordList> {
  List<WordModel> sortedWordList = [];

  @override
  void initState() {
    sortedWordList = List.of(widget.wordList);
    sortedWordList.sort((a, b) => a.word.compareTo(b.word));
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(itemBuilder: (context, index) {
      final item = sortedWordList[index];
      return Dismissible(
          key: Key(item.id),
          onDismissed: (DismissDirection direction) {
            removeWord(item.id);
            setState(() {
              sortedWordList.removeAt(index);
            });
          },
          child: CupertinoListTile(
            title: Text(item.word),
            trailing: Text(item.translation),
          ));
    });
  }
}
