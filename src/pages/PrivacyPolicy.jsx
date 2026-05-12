import React, { useEffect } from 'react';
import LegalPage from './LegalPage';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <LegalPage title="Privacy Policy" lastUpdated="May 12, 2026">
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-[#2EF2C4] mb-4">1. Data Controller (Impressum)</h2>
          <p>
            The data controller responsible for your personal information is:<br />
            <strong>Gergő Takács</strong><br />
            7700 Mohács, Rákóczi utca 8, Hungary<br />
            Email: <a href="mailto:takacs.gergo2000@gmail.com" className="text-[#7A3CFF] hover:underline">takacs.gergo2000@gmail.com</a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#2EF2C4] mb-4">2. Information We Collect</h2>
          <p>When you play Gnosis Online or use our services, we may collect the following information:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>Authentication Data:</strong> Your Steam ID and Google/Gmail address (for Admin/Web access).</li>
            <li><strong>Connection Data:</strong> Your IP address, which is necessary for server connection, latency optimization, and security purposes.</li>
            <li><strong>Hardware & Telemetry Data:</strong> Information about your computer hardware, operating system, and in-game performance. This is used strictly for game optimization, crash reporting, and Anti-Cheat mechanisms.</li>
            <li><strong>Gameplay Data:</strong> In-game progression, inventory, and activity logs stored securely in our databases.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#2EF2C4] mb-4">3. Third-Party Services</h2>
          <p>We utilize trusted third-party services to operate the game. These providers have their own Privacy Policies:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>Google Firebase:</strong> Used for website backend, authentications, and web database services.</li>
            <li><strong>MySQL Servers:</strong> Used for storing core gameplay data and progression.</li>
            <li><strong>Valve / Steam:</strong> Used for game distribution, secure login (Steamworks API), and in-game purchases.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#2EF2C4] mb-4">4. How We Use Your Data</h2>
          <p>We do not sell your personal data. We use it solely to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Provide, maintain, and improve the Gnosis Online experience.</li>
            <li>Detect, investigate, and prevent cheating, hacking, or unauthorized modifications.</li>
            <li>Respond to your customer service requests.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#2EF2C4] mb-4">5. Your GDPR Rights</h2>
          <p>
            As a resident of the European Union, you have the right to access, modify, or request the deletion of your personal data. To exercise these rights, please contact us at the email provided in Section 1. Note that requesting the deletion of your data will result in the permanent termination of your Gnosis Online account.
          </p>
        </section>
      </div>
    </LegalPage>
  );
}