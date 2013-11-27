var nouns = [],
    verbs = [],
    adjs  = [];

Array.prototype.pick = function() {
  return this[Math.floor(Math.random()*this.length)];
};

function generate() {
  var generatedText = '<div class="inner"><h3>Random Praise for Random Friday</h3>"This is the single most ' + adjs.pick() + ' thing that has ever happened in the history of ' + nouns.pick().pluralize() + '."<br>&mdash;<em>' + nouns.pick().titleize() + ' Weekly</em><br><br>"I thought the holiday season was about ' + nouns.pick().pluralize() + ', but Random Friday taught me I was wrong."<br>&mdash;<em>' + nouns.pick().titleize() + ' Magazine</em><br><br>"Sure. Instead of Random Friday, get your loved one that ' + nouns.pick() + ' this holiday season. I dare you."<br>&mdash;<em>The ' + adjs.pick().titleize() + ' ' + nouns.pick().titleize() + '<em></div>';
  var sharedText = 'Experience Black Friday the way it was meant to be experienced: entirely at random.';
  $('#content').html(generatedText);
  var shareUrl = window.location.href.split('?')[0];
  $('#share').attr('href', shareUrl);
  $('.twitter-share-button').remove();
  $('#twitterShare').html('<a href="https://twitter.com/share" class="twitter-share-button" data-size="large" data-url="' + shareUrl + '" data-text="' + sharedText + '" data-lang="en">Tweet</a>');
  if (twttr.widgets) {
    twttr.widgets.load();
  }
}

function getWords(suppressGenerate) {
  $.when(
    $.ajax({
      url: 'http://api.wordnik.com/v4/words.json/randomWords?minCorpusCount=10000&minDictionaryCount=5&excludePartOfSpeech=proper-noun,proper-noun-plural,proper-noun-posessive,suffix,family-name,idiom,affix&hasDictionaryDef=true&includePartOfSpeech=noun&limit=1000&maxLength=22&api_key='+key.API_KEY,
      async: false,
      dataType:'json'
    }),
    $.ajax({
      url: 'http://api.wordnik.com//v4/words.json/randomWords?limit=1000&excludePartOfSpeech=adjective&hasDictionaryDef=true&includePartOfSpeech=verb-transitive&minCorpusCount=1000&api_key='+key.API_KEY,
      async: false,
      dataType:'json'
    }),
    $.ajax({
      url: 'http://api.wordnik.com//v4/words.json/randomWords?limit=1000&hasDictionaryDef=true&includePartOfSpeech=adjective&minCorpusCount=80000&api_key='+key.API_KEY,
      async: false,
      dataType:'json'
    })
  ).done(function(noun_data, verb_data, adj_data) {
    nouns = $.map(noun_data[0], function(el) { return el.word; });
    nouns = sanitize(nouns);
    verbs = $.map(verb_data[0], function(el) { return el.word; });
    verbs = sanitize(verbs);
    adjs = $.map(adj_data[0], function(el) { return el.word; });
    adjs = sanitize(adjs);
    if (!suppressGenerate) {
      generate();
    }
  });
}

function sanitize(arr) {
  for (var i=0; i<blacklist.length; i++) {
    arr = arr.filter(function(el) { return el.indexOf(blacklist[i]) < 0 });
  }
  return arr;
}

$('#generate').click(function() { generate(); });
getWords();
