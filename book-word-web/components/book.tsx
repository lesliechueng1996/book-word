import BookModel from '@/model/book-model';

export default function Book({ book }: { book: BookModel }) {
  return (
    <div
      title={book.name}
      className="w-40 h-48 border-solid border-4 border-gray-500 px-4 flex flex-col gap-3 justify-center items-center cursor-pointer"
    >
      <span className="overflow-hidden w-full block text-ellipsis whitespace-nowrap text-center">
        {book.name}
      </span>
      <span>假装有图</span>
    </div>
  );
}
