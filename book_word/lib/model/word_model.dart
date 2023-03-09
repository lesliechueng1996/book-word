class WordModel {
  final String id;
  final String word;
  final String translation;
  final String bookId;
  final String userId;
  final String createTime;

  WordModel(
      {required this.id,
      required this.word,
      required this.translation,
      required this.bookId,
      required this.userId,
      required this.createTime});

  factory WordModel.fromJson(Map<String, dynamic> json) {
    return WordModel(
        id: json['id'],
        word: json['word'],
        translation: json['translation'],
        bookId: json['bookId'],
        userId: json['userId'],
        createTime: json['createTime']);
  }
}
