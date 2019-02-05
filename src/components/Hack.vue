<template>
  <div class="hack">
    <div>
      <a @click="setAdministrator">
        Administrator
      </a>|
      <a @click="setLocalAdmin">
        Local admin
      </a>|
      <a @click="setENTAdmin">
        ENT admin
      </a>|
      <a @click="setUser">
        None
      </a>
    </div>
    <div>
      <a @click="setStudentRole">
        Student
      </a>|
      <a @click="setTeacherRole">
        Teacher
      </a>|
      <a @click="setPersonnelRole">
        Personnel
      </a>|
      <a @click="setParentRole">
        Parent
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Hack',
  methods: {
    setAdministrator () {
      this.$store.dispatch('user/hack', { isAdministrator: true })
    },
    setLocalAdmin () {
      this.$store.dispatch('user/hack', { isLocalAdmin: true })
    },
    setENTAdmin () {
      this.$store.dispatch('user/hack', { isENTAdmin: true })
    },
    setUser () {
      this.$store.dispatch('user/hack', { isUser: true })
    },
    setStudentRole () {
      this.$store.dispatch('user/hack', { isStudent: true })
    },
    setTeacherRole () {
      this.$store.dispatch('user/hack', { isTeacher: true })
    },
    setPersonnelRole () {
      this.$store.dispatch('user/hack', { isPersonnel: true })
    },
    setParentRole () {
      this.$store.dispatch('user/hack', { isParent: true })
    }
  }
}
</script>

<style lang="scss" scoped>
.hack {
  position: fixed;
  bottom: 10px;
  right: 100px;
  min-height: 20px;
  min-width: 50px;

  &:hover {
    display: initial;

    div {
      display: initial;
    }
  }

  div {
    padding: 3px;
    border-radius: 7px;
    background-color: rgba(50, 50, 50, 0.8);
    display: none;

    a {
      display: inline-block;
      color: lightcyan;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
        color: orangered;
      }
    }
  }
}
</style>
