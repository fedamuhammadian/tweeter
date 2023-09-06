/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(()=>{
  // in order to hide the error messages and new tweet 
  $('.error-message').hide();
  //$('.new-tweet').hide();
    
  const escape = function (str) {
    let div = $("<div></div>").text(str);
    return div.html();
  };

  // creates html for tweet
  const createTweetElement = function(tweet) {
    let $tweet = `
      <article class="tweetArticle">
      <header class="tweet-header">
        <div class="profile-picture">
        <img src="${escape(tweet.user.avatars)}" alt="avatar">
        <p>${escape(tweet.user.name)}</p>   
        </div>      
        <p id="profile-name">${escape(tweet.user.handle)}</p>
    
      </header>
        <p id="tweet-text" class="tweet-textarea">${escape(tweet.content.text)}</p>
    
      <footer class="tweet-footer">
        <p id = "formattedTime">${formatDate(tweet.created_at)}</p>
        <div>
        <i class="fa-solid fa-flag" id="tweet-icons"></i>
        <i class="fa-solid fa-retweet" id="tweet-icons"></i>
        <i class="fa-solid fa-heart" id="tweet-icons"></i>
        </div>
      </footer>
      </article> <br>
    `
    return $tweet;
  }

  const composeTweet = $('.nav-button')
  composeTweet.on('click', function () {
    if ($('.new-tweet').is(":hidden")) {
      $('.new-tweet').slideDown( "slow" );
      $('form').slideup('slow');
    }
  })
  const renderTweets = function(tweets) {
    $('.tweet-container').empty()
    for (let item of tweets) {      
      const result = createTweetElement(item) 
      $('.tweet-container').append(result)  
    }
  }  

  const form = $('form');
  form.on("submit", function (event)  {
  event.preventDefault();
  console.log('form submission!');

  const tweetContent = $("#tweet-text").val().trim(); 
  if (tweetContent.length === 0) {
    $(".error-message").html(
      `<p><i class="fa-solid fa-triangle-exclamation"></i>Tweet can not be empty, content requried!<i class="fa-solid fa-triangle-exclamation"></i></p>`
    );
    $('.error-message').slideDown( "slow" );
    return false;
  }

  if ( tweetContent.length > 140) {
    $(".error-message").html(
      `<p><i class="fa-solid fa-triangle-exclamation"></i>Tweet is too long and can not be posted" <i class="fa-solid fa-triangle-exclamation"></i></p>`
    );
    $('.error-message').slideDown( "slow" );
    return false;
  }

  $(".error-message").html("");
  $('.error-message').slideUp("slow"); 

  const data =$( this ).serialize();

    $.ajax({
      type: "POST",
      url: '/tweets',
      data
    })
    .then(() => {
      loadTweets()
    })
    .fail(() => {
      $(".error-message").html(
        `<p><i class="fa-solid fa-triangle-exclamation"></i>Error ocurred when submitting your tweet<i class="fa-solid fa-triangle-exclamation"></i></p>`
      );
      $('.error-message').slideDown("slow");
    });
  });

  const loadTweets= function () {
    $.ajax({
      method: "GET",
      dataType: "json",
      url: '/tweets',
    })
    .then((tweetData) => {
      const reversedTweetData = tweetData.reverse();
  
      renderTweets(reversedTweetData);
      $("#tweet-text").val('');
      $('.counter').val(140);
    })
    .fail(() => {
      $(".error-message").html(
        `<p><i class="fa-solid fa-triangle-exclamation"></i>Error submitting tweet<i class="fa-solid fa-triangle-exclamation"></i></p>`
      );
      $('.error-message').slideDown("slow");
    });
  }
  loadTweets();
  
  const formatDate = function (timeStamp) {
    return timeago.format(timeStamp);
  }
});
