import { DocumentsList } from "@/components/DocumentsList";
import { DocumentCategory } from "@/components/DocumentCategory";

export default function DocumentsPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="md:col-span-1">
        <DocumentCategory />
      </div>
      <div className="md:col-span-3">
        <DocumentsList />
      </div>
    </div>
  );
}
