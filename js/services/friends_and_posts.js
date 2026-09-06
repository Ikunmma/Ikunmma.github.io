utils.jq(() => {
  $(function () {
    const containers = document.getElementsByClassName('ds-friends_and_posts');

    const safeUrl = (value, fallback) => {
      try {
        const url = new URL(value, window.location.origin);
        return ['http:', 'https:'].includes(url.protocol) ? url.href : fallback;
      } catch (error) {
        return fallback;
      }
    };

    const text = (tag, className, value) => {
      const node = document.createElement(tag);
      if (className) node.className = className;
      node.textContent = value || '';
      return node;
    };

    for (const container of containers) {
      const api = container.getAttribute('api');
      const grid = container.querySelector('.grid-box');
      if (!api || !grid) continue;

      utils.request(container, api, function (data) {
        const items = Array.isArray(data.content) ? data.content : data;
        if (!Array.isArray(items) || items.length === 0) {
          grid.appendChild(text('p', 'friends-empty', '还没有友链，欢迎成为第一位朋友。'));
          return;
        }

        items.forEach(item => {
          const siteUrl = safeUrl(item.html_url || item.url, '#');
          const card = document.createElement('article');
          card.className = 'grid-cell user-post-card';

          const header = document.createElement('div');
          header.className = 'friend-header';
          const siteLink = document.createElement('a');
          siteLink.className = 'friend-site';
          siteLink.href = siteUrl;
          siteLink.target = '_blank';
          siteLink.rel = 'external nofollow noopener noreferrer';

          const avatar = document.createElement('img');
          avatar.className = 'friend-avatar';
          avatar.alt = '';
          avatar.loading = 'lazy';
          avatar.src = safeUrl(item.avatar_url || item.avatar || item.icon, def.avatar);
          avatar.onerror = function () { this.src = def.avatar; };

          const identity = document.createElement('span');
          identity.className = 'friend-identity';
          identity.appendChild(text('strong', 'friend-name', item.title || item.login || '未命名站点'));
          identity.appendChild(text('span', 'friend-desc', item.description || '去朋友的小站看看'));
          siteLink.append(avatar, identity);
          header.appendChild(siteLink);

          const labels = document.createElement('span');
          labels.className = 'friend-labels';
          (item.labels || []).slice(0, 2).forEach(label => {
            const badge = text('span', 'friend-label', label.name);
            if (/^[0-9a-f]{6}$/i.test(label.color || '')) {
              badge.style.setProperty('--label-color', `#${label.color}`);
            }
            labels.appendChild(badge);
          });
          header.appendChild(labels);
          card.appendChild(header);

          const posts = document.createElement('div');
          posts.className = 'friend-posts';
          if (Array.isArray(item.posts) && item.posts.length > 0) {
            item.posts.slice(0, 3).forEach(post => {
              const postLink = document.createElement('a');
              postLink.className = 'friend-post';
              postLink.href = safeUrl(post.link, siteUrl);
              postLink.target = '_blank';
              postLink.rel = 'external nofollow noopener noreferrer';
              postLink.appendChild(text('span', 'post-title', post.title || '未命名文章'));
              postLink.appendChild(text('time', 'post-date', (post.published || '').slice(0, 10)));
              posts.appendChild(postLink);
            });
          } else {
            posts.appendChild(text('span', 'friend-no-post', item.feed ? '暂时没有获取到新文章' : '这个朋友还没有设置 RSS'));
          }
          card.appendChild(posts);
          grid.appendChild(card);
        });
      }, function () {
        grid.appendChild(text('p', 'friends-empty', '友链暂时加载失败，请稍后刷新。'));
      });
    }
  });
});
