import { ProfileHeader } from "./components/profile-header";
import { PersonalDetailsSection } from "./components/personal-details-section";
import { AddressSection } from "./components/address-section";
import { ProfilePhotoSection } from "./components/profile-photo-section";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] px-6 py-8">
      <ProfileHeader />

      <div className="grid grid-cols-2 gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <PersonalDetailsSection />
          <AddressSection />
        </div>

        <div>
          <ProfilePhotoSection />
        </div>
      </div>
    </div>
  );
}
