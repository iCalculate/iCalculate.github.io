(function () {
  'use strict';

  function headingIndex(article, targetId) {
    var headings = Array.prototype.slice.call(
      article.querySelectorAll('.lang-en h1, .lang-en h2, .lang-en h3, .lang-en h4, .lang-en h5, .lang-en h6')
    );
    return headings.findIndex(function (heading) {
      return heading.id === targetId;
    });
  }

  function installTocBridge(article, getLanguage) {
    var toc = document.querySelector('.toc');
    if (!toc) return;

    toc.addEventListener('click', function (event) {
      if (getLanguage() !== 'zh') return;
      var link = event.target.closest('a[href^="#"]');
      if (!link) return;

      var targetId = decodeURIComponent(link.getAttribute('href').slice(1));
      var index = headingIndex(article, targetId);
      var chineseHeadings = article.querySelectorAll('.lang-zh .zh-heading');
      if (index < 0 || !chineseHeadings[index]) return;

      event.preventDefault();
      chineseHeadings[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function initializeSwitcher(switcher) {
    var article = switcher.closest('.article-entry');
    if (!article) return;

    var buttons = switcher.querySelectorAll('[data-language]');
    var panels = article.querySelectorAll('.lang-panel');
    var currentLanguage = 'en';
    var title = document.querySelector('.intro-title[data-title-en]');
    var originalDocumentTitle = document.title;
    var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.toc a[href^="#"]'));
    var englishHeadings = article.querySelectorAll('.lang-en h2, .lang-en h3');
    var chineseHeadings = article.querySelectorAll('.lang-zh .zh-h2, .lang-zh .zh-h3');
    var originalTocLabels = tocLinks.map(function (link) { return link.textContent; });

    function setLanguage(language) {
      currentLanguage = language === 'zh' ? 'zh' : 'en';
      Array.prototype.forEach.call(buttons, function (button) {
        button.setAttribute(
          'aria-pressed',
          button.getAttribute('data-language') === currentLanguage ? 'true' : 'false'
        );
      });
      Array.prototype.forEach.call(panels, function (panel) {
        panel.hidden = !panel.classList.contains('lang-' + currentLanguage);
      });
      document.documentElement.setAttribute('lang', currentLanguage === 'zh' ? 'zh-CN' : 'en');
      if (title) {
        var translatedTitle = title.getAttribute('data-title-' + currentLanguage);
        title.textContent = translatedTitle;
        var bannerTitle = document.querySelector('.post-name');
        if (bannerTitle) bannerTitle.textContent = translatedTitle;
        document.title = currentLanguage === 'en' ? originalDocumentTitle : originalDocumentTitle.replace(title.getAttribute('data-title-en'), translatedTitle);
      }
      document.querySelectorAll('[data-reading-en]').forEach(function (element) {
        element.textContent = element.getAttribute('data-reading-' + currentLanguage);
      });
      tocLinks.forEach(function (link, index) {
        var id;
        try { id = decodeURIComponent(link.getAttribute('href').slice(1)); } catch (_) { return; }
        var headingIndex = Array.prototype.findIndex.call(englishHeadings, function (heading) { return heading.id === id; });
        link.textContent = currentLanguage === 'zh' && chineseHeadings[headingIndex] ? chineseHeadings[headingIndex].textContent : originalTocLabels[index];
      });
      window.dispatchEvent(new Event('resize'));
    }

    Array.prototype.forEach.call(buttons, function (button) {
      button.addEventListener('click', function () {
        setLanguage(button.getAttribute('data-language'));
      });
    });

    installTocBridge(article, function () { return currentLanguage; });
    setLanguage('en');
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(
      document.querySelectorAll('.language-switcher'),
      initializeSwitcher
    );
  });
})();

