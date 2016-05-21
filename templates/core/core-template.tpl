<link rel="import" href="../../../vendor/polymer/polymer.html">

<!-- style module -->
<link rel="import" href="styles/<%= prefix %>-<%= name %>-styles.html">

<dom-module id="<%= prefix %>-<%= name %>">
  <template>
    <style include="<%= prefix %>-<%= name %>-styles"></style>

  </template>
  <script>
    (function() {
      'use strict';

      Polymer({
        is: '<%= prefix %>-<%= name %>'
      });
    })();
  </script>
</dom-module>
