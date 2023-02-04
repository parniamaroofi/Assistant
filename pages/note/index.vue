<template>
  <div class="container" id="saving-note">
            <br><br>
            <div class="card form-bord">

                <div class="the-form">

                    <label for="name"><span class="red-text">*</span> Name : <input type="text" id="name-in" v-model="newName" autocomplete="off"></label>
                    <label for="subject">Subject : <input type="text" id="subject=-in" v-model="newSubject" autocomplete="off"></label>
                    <label for="name"><span class="red-text">*</span> Note : <textarea v-model="newText"></textarea></label>
                    <transition name="fade">
                    <span v-show="error" class="error"><i class="material-icons red-text left">cancel</i>Oops! you must fill in the name field and the note field.</span>
                    </transition>
                    <transition name="fade">
                    <span v-show="done" class="done"><i class="material-icons green-text left">check_circle</i>Saved!</span>
                    </transition>
                    <div class="btn waves-effect save-btn" v-on:click="saving">Save</div>
                    
                    
     
                </div>

            </div>
            <br><br><br><br>
            <div class="show-note">
                <label>Saved Notes</label>
                <br><br>
                
                <div class="card note-box" v-for="(note,index) in notes" v-if="note.name">
                    
                    <div class="content">
                        <ul>
                            <li><i class="material-icons left">person</i> {{note.name}}</li>
                            <li v-if="note.subject"><i class="material-icons left">subject</i> {{note.subject}}</li>
                            <li class="text"><i class="material-icons left">rate_review</i> {{note.note_text}}</li>
                        </ul>
                    </div>
                    <div class="card-action">
                        <span class="left" id="date-time">{{note.time}}</span>
                        <span class="del-note right" v-on:click="deleteNote(index)"><i class="material-icons" title="delete">delete_forever</i></span>
                    </div>
                    
                </div>

            </div>

        </div>
</template>

<script>

const notes =[
    {
        name: '',
        subject:'',
        note_text: "",
        time: "",
    },
]

export default {
  data() {
      return {
        notes: notes,
        newName: '',
        newSubject: '',
        newText: '',
        error:false,
        done:false,
      }
  },
  methods:{
        saving: function(){
            let dt = new Date();
            if(!this.newName || !this.newText){
                this.error = true;
                this.done = false;
                setTimeout(() => this.error = false, 2000);
            }
            else{ 
                this.notes.push({
                    name: this.newName,
                    subject: this.newSubject,
                    note_text: this.newText,
                    time: dt.toLocaleString(),
                });
                this.error = false;
                this.done = true;
                setTimeout(() => this.done = false, 2000);
                this.newName = '';
                this.newSubject ='';
                this.newText ='';
            }
            
        },

        deleteNote: function(index){
            if (confirm("Do you really want to delete this note?")) {
                notes.splice(index,1)
            } 
            else {
            console.log('The operation was canceled!')
            }
        }
    }
}
</script>

<style scoped>

</style>
