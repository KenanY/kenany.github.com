(function(window, undefined) {
  var jsonp    = require('LearnBoost-jsonp'),
      each     = require('manuelstofer-each'),
      relative = require('component-relative-date'),
      $        = require('component-dom');

  var getRepoLang = function(repo) {
    if (repo.language) {
      return repo.language;
    }
    else {
      return 'HTML/CSS';
    }
  }

  jsonp('https://api.github.com/users/KenanY/repos?type=public', function(err, data) {
    var repos = data.data;

    $('num-repos').text(repos.length);

    each(repos, function(repo, i) {
      repo.pushed_at = new Date(repo.pushed_at);

      var weekHalfLife      = 1.146 * Math.pow(10, -9),
          pushDelta         = (new Date) - Date.parse(repo.pushed_at),
          createdDelta      = (new Date) - Date.parse(repo.created_at),
          weightForPush     = 1,
          weightForWatchers = 1.314 * Math.pow(10, 7);

      repo.hotness  = weightForPush * Math.pow(Math.E, -1 * weekHalfLife * pushDelta);
      repo.hotness += weightForWatchers * repo.watchers / createdDelta;
    });

    repos.sort(function(a, b) {
      if (a.hotness < b.hotness) return 1;
      if (b.hotness < a.hotness) return -1;
      return 0;
    });

    each(repos, function(repo, i) {
      var $item = $('<li><a href="' + repo.html_url + '">' + repo.name + '</a></li>'),
          $link = $('<ul>');

      $link.append('<li>' + repo.watchers + ' stargazers &middot; ' + getRepoLang(repo) + '</li>');
      $link.append('<li>' + repo.description + '</li>');
      $link.append('<li>Last updated: ' + relative(repo.pushed_at) + ' ago</li>');

      $link.appendTo($item);
      $item.appendTo('#repos');
    });

    repos.sort(function(a, b) {
      if (a.pushed_at < b.pushed_at) return 1;
      if (b.pushed_at < a.pushed_at) return -1;
      return 0;
    });

    each(repos.slice(0, 3), function(repo, i) {
      var item = '<li>';
      item += '<span class="name"><a href="' + repo.html_url + '">' + repo.name + '</a></span>';
      item += ' &middot; <span class="time"><a href="' + repo.html_url + '/commits">' + relative(repo.pushed_at) + ' ago</a></span>';
      item += '</li>';

      $(item).appendTo("#updated-repos");
    });
  });
}(this));