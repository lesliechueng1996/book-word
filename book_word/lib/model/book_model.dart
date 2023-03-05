class BookModel {
  final String id;
  final String name;
  final String? author;
  final String url;
  final String createTime;

  BookModel({
    required this.id,
    required this.name,
    this.author,
    required this.url,
    required this.createTime,
  });

  factory BookModel.fromJson(Map<String, dynamic> json) {
    return BookModel(
        id: json['id'],
        name: json['name'],
        author: json['author'],
        url: json['url'],
        createTime: json['createTime']);
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'author': author,
        'url': url,
        'createTime': createTime
      };
}
