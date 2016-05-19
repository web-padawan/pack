<link rel="import" href="../../../vendor/polymer/polymer.html">

<dom-module id="<%= prefix %>-<%= name %>">
  <template>
    <style>
      :host {
        display: block;
      }
    </style>

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
