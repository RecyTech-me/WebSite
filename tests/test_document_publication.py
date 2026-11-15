"""Guard the static publication boundary: only statutes may be public PDFs."""
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class DocumentPublicationTests(unittest.TestCase):
    def test_only_statutes_are_published_as_pdfs(self):
        pdfs = {p.relative_to(ROOT).as_posix() for p in ROOT.rglob('*.pdf')}
        self.assertEqual(pdfs, {'documents/statutes/statuts-recytech.pdf'})

    def test_public_index_keeps_statutes_and_uses_authenticated_document_routes(self):
        index = (ROOT / 'documents/index.html').read_text()
        self.assertIn('href="./statutes/statuts-recytech.pdf"', index)
        for group in ('committee', 'general-meeting'):
            destination = f'https://shop.recytech.me/association-documents/{group}'
            self.assertIn(f'href="{destination}"', index)
            legacy_page = (ROOT / f'documents/{group}.html').read_text()
            self.assertIn(f'href="{destination}"', legacy_page)
            self.assertNotIn('.pdf', legacy_page)
            self.assertFalse((ROOT / f'documents/{group}').exists())


if __name__ == '__main__':
    unittest.main()
