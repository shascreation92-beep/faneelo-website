async function check() {
  const urls = [
    'https://faneelo-website.vercel.app',
    'https://faneelo.vercel.app',
    'https://www.faneelo.co.uk'
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url);
      console.log('===', url, '===');
      console.log('Status:', res.status);
      console.log('Cache:', res.headers.get('x-vercel-cache'));
      const html = await res.text();
      const scripts = html.match(/src="\/assets\/[^"]+"/g);
      console.log('Scripts:', scripts);
      if (html.includes('Working on Our Website') || html.includes('Working On Site')) {
        console.log('>>> CONTAINS MAINTENANCE TEXT! <<<');
      }
    } catch (e) {
      console.log('Error for', url, e.message);
    }
  }
}
check();
