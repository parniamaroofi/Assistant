<template>
  <div>
    <div class="pa-3">
      <!-- dialCode search field -->
      <v-text-field
        dense
        rounded
        filled
        placeholder="Search in country name..."
        hideDetails
        class="mb-2 no-border-field"
        style="background-color: #fff"
        v-model="countryFilter"
      >
        <!-- SEARCH icon -->
        <template v-slot:prepend-inner>
          <div>
            <v-icon class="mr-2">$Search</v-icon>
          </div>
        </template>
        <!-- CLOSE icon -->
        <template v-slot:append>
          <div class="pointer" v-if="countryFilter" @click="countryFilter = ''">
            <v-icon color="primary" small class="mt-1">mdi-close</v-icon>
          </div>
        </template>
      </v-text-field>

      <div class="dialCodes-list">
        <!-- NO RESULT box when there is no filter result for country -->
        <div v-if="!filteredContries.length" class="text-center">
          <span class="fs-medium grey--text"
            >No result for "{{ countryFilter }}"</span
          >
        </div>

        <!-- dialCode item -->
        <div
          v-for="(item, index) in filteredContries"
          :key="index"
          class="list-item d-flex justify-space-between fs-medium pointer"
          @click="selectDialCode(item)"
        >
          <p class="mb-0">
            <!-- country flag -->
            <country-flag :country="item.code" size="small" />
            <!-- country name -->
            <span class="pl-1 fs-small mainBlack--text">
              {{
                item.name.length > 28
                  ? `${item.name.slice(0, 28)}...`
                  : item.name
              }}
            </span>
          </p>
          <!-- country dialCode -->
          <p class="secondary--text mb-0 fs-small">
            {{ item.dial_code }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CountryFlag from "vue-country-flag";
import CountryCodes from "./../../mixin/CountryCodes.vue";
export default {
  components: {
    CountryFlag,
  },
  mixins: [CountryCodes],
  data() {
    return {
      countryFilter: "",
    };
  },

  methods: {
    selectDialCode(item) {
      this.$emit("select", item);
    },
  },

  computed: {
    // Filter countries in dialCodes list
    filteredContries() {
      let filtered = this.countryCodes.filter((x) =>
        x.name.toLowerCase().includes(this.countryFilter)
      );
      return filtered;
    },
  },
};
</script>
