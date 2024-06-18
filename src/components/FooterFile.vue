<template>
  <footer class="footer">
    <p>&copy; Sergio Penagos All rights reserved.</p>
    <div
      class="contact-options is-flex is-justify-content-center"
      data-aos="fade-left"
    >
      <a :href="'mailto:' + email" title="Email" data-aos="flip-right"
        ><span class="icon is-large is-hoverable is-size-3"
          ><i class="fa fa-envelope"></i></span
      ></a>
      <a
        href="https://www.linkedin.com/in/analyst-sergio-penagos/"
        target="_blank"
        title="linkedin"
        data-aos="flip-right"
      >
        <span class="icon is-large is-hoverable is-size-3">
          <i class="fab fa-linkedin"></i>
        </span>
      </a>
      <a :href="github" target="_blank" title="GitHub" data-aos="flip-right"
        ><span class="icon is-large is-hoverable is-size-3"
          ><i class="fab fa-github"></i></span
      ></a>
      <a :href="github2" target="_blank" title="GitHub" data-aos="flip-right"
        ><span class="icon is-large is-hoverable is-size-3"
          ><i class="fab fa-github"></i></span
      ></a>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "FooterFile",
  setup() {
    const email = "sergiopenagos881@gmail.com";
    const github = "https://github.com/gioudi";
    const github2 = "https://github.com/SergioVass";

    return {
      email,
      github,
      github2,
    };
  },
});
</script>
