import 'package:book_word/api/word_api.dart';
import 'package:book_word/model/word_model.dart';
import 'package:flutter/cupertino.dart';

class TranslationList extends StatelessWidget {
  final List<String> dstList;
  final String bookId;
  final String word;
  final void Function(WordModel) addNewWordCallback;

  const TranslationList(
      {super.key,
      required this.dstList,
      required this.bookId,
      required this.word,
      required this.addNewWordCallback});

  @override
  Widget build(BuildContext context) {
    return dstList.isEmpty
        ? const Center(
            child: Text('请翻译单词'),
          )
        : ListView.builder(
            itemBuilder: (BuildContext context, index) => Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(dstList[index]),
                    CupertinoButton(
                        child: const Text('记录'),
                        onPressed: () async {
                          final WordModel newWord =
                              await saveWord(bookId, word, dstList[index]);
                          addNewWordCallback(newWord);
                        })
                  ],
                ));
  }
}
