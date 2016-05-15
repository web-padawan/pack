<link rel="import" href="../../../vendor/polymer/polymer.html">
<link rel="import" href="../../layout/pb-layout/pb-layout.html">

<dom-module id="pb-{{page}}-page">
  <template>
    <style include="shared-styles">
      :host {
        display: block;
      }
    </style>

    <pb-layout>
      <div container>
        <h1>{{page}}</h1>
      </div>
    </pb-layout>

  </template>
  <script>
    (function() {
      'use strict';

      Polymer({
        is: 'pb-{{page}}-page'
      });
    })();
  </script>
</dom-module>
