import 'package:book_word/model/word_model.dart';

import '../util/http_util.dart';

Future<List<String>> translate(String? word) async {
  if (word == null) {
    return [];
  }
  final response = await get(
      uri: '/api/app/word/translation',
      queryParameters: {'word': word}).then((value) => {value['dst']});
  return List.from(response);
}

Future<WordModel> saveWord(
    String bookId, String word, String translation) async {
  final response = await post(
      uri: '/api/app/words/$bookId/word',
      body: {'word': word, 'translation': translation});

  return WordModel.fromJson(response);
}

Future<List<WordModel>> myWordInThisBook(String bookId) async {
  final response = await get(uri: '/api/app/words/$bookId/word');

  return response['words'].map((item) => WordModel.fromJson(item));
}

Future<void> removeWord(String wordId) async {
  await delete(uri: '/api/app/word/$wordId');
}
