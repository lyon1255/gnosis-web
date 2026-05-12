import React, { useEffect } from 'react';
import LegalPage from './LegalPage';

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <LegalPage title="Terms of Service" lastUpdated="May 12, 2026">
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-[#7A3CFF] mb-4">1. Acceptance of Terms & Age Restriction</h2>
          <p>
            By accessing or playing Gnosis Online, you agree to be bound by these Terms of Service. 
            Due to the presence of violent content (blood, combat), <strong>you must be at least 13 years old</strong> to play Gnosis Online. If you are between 13 and 18 years of age, you must have the permission of a parent or legal guardian to play.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#7A3CFF] mb-4">2. Code of Conduct & Anti-Cheat Policy</h2>
          <p>
            Gnosis Online is a competitive and cooperative multiplayer environment. We enforce a strict <strong>Zero Tolerance Policy</strong> against cheating.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>You may not use unauthorized third-party software, macros, bots, or hacks.</li>
            <li>Exploiting game bugs or glitches for unfair advantage is strictly prohibited.</li>
            <li>Real Money Trading (RMT) — the selling or buying of in-game items, currency, or accounts for real-world money — is forbidden.</li>
          </ul>
          <p className="mt-4 font-bold text-red-400">
            Violation of these rules will result in an immediate, permanent, and non-appealable ban from Gnosis Online.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#7A3CFF] mb-4">3. Virtual Goods and Purchases</h2>
          <p>
            Gnosis Online may include in-game currencies or virtual items. When you purchase or earn these items, you do not own them; you are granted a limited, personal, non-transferable, and revocable <strong>license</strong> to use them within the game.
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Virtual goods have no real-world monetary value.</li>
            <li>All purchases are final and non-refundable, except where required by law.</li>
            <li>If your account is terminated due to a violation of Section 2, you will lose access to all virtual goods without any right to a refund.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#7A3CFF] mb-4">4. Limitation of Liability</h2>
          <p>
            The game is provided "as is" and "as available". We do not guarantee that the servers will be online uninterrupted or error-free. We reserve the right to modify, suspend, or shut down the game (or any part of it) at any time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#7A3CFF] mb-4">5. Contact</h2>
          <p>
            For any legal inquiries regarding these terms, please contact: <a href="mailto:takacs.gergo2000@gmail.com" className="text-[#2EF2C4] hover:underline">takacs.gergo2000@gmail.com</a>.
          </p>
        </section>
      </div>
    </LegalPage>
  );
}