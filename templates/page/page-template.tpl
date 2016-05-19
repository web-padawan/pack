<link rel="import" href="../../../vendor/polymer/polymer.html">
<link rel="import" href="../../layout/<%= prefix %>-layout/<%= prefix %>-layout.html">

<dom-module id="<%= prefix %>-<%= page %>-page">
  <template>
    <style include="shared-styles">
      :host {
        display: block;
      }
    </style>

    <<%= prefix %>-layout>
      <div container>
        <h1><%= page %></h1>
      </div>
    </<%= prefix %>-layout>

  </template>
  <script>
    (function() {
      'use strict';

      Polymer({
        is: '<%= prefix %>-<%= page %>-page'
      });
    })();
  </script>
</dom-module>
