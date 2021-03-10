<template>
    <select v-el:select>
        <option v-for="option in options" :value="option.value">
            {{option.text}}
        </option>
    </select>
</template>

<script>
export default {
  name: "b-select-2",
  props: {
  	value: "",
    options: [],
  },
  data: function() {
    return {};
  },
  watch: {
    options: function() {
      var select = $(this.$els.select);
      select.selectpicker("refresh");
    },
    value: function() {
      var select = $(this.$els.select);
      select.selectpicker("val", this.value);
    }
  },
  ready: function() {
    var select = $(this.$els.select);
    select.selectpicker();
    select.selectpicker("val", this.value);
    var self = this;
    select.on("changed.bs.select", function() {
    	self.value = select.selectpicker("val");
    });
  }
}
</script>
