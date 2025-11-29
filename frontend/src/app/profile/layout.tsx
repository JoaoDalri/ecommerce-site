import ProfileSidebar from '@/components/ProfileSidebar';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        <ProfileSidebar />
        <main className="flex-1 bg-white rounded-xl shadow-sm border p-8 min-h-[500px]">
          {children}
        </main>
      </div>
    </div>
  );
}