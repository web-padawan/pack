<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title><%= prefix %>-<%= name %> test</title>
    <script src="../../../../vendor/webcomponentsjs/webcomponents-lite.min.js"></script>
    <script src="../../../../vendor/web-component-tester/browser.js"></script>
    <link rel="import" href="../<%= prefix %>-<%= name %>.html">
  </head>
  <body>
    <test-fixture id="<%= prefix %>-<%= name %>-fixture">
      <template>
        <<%= prefix %>-<%= name %>></<%= prefix %>-<%= name %>>
      </template>
    </test-fixture>
    <script>
      suite('<<%= prefix %>-<%= name %>>', function() {
        var element;
        setup(function() {
          element = fixture('<%= prefix %>-<%= name %>-fixture');
        });
        test('<%= prefix %>-<%= name %> works as expected', function(done) {
          // place your test here
        });
      });
    </script>
  </body>
</html>
