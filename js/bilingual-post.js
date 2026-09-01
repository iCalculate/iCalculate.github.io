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

