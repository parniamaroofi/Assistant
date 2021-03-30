const notes =[
    {
        name: '',
        subject:'',
        note_text: '',
        time: '',
    },
]

new Vue({
    el: '#saving-note',
    data:{
        notes: notes,
        newName: '',
        newSubject: '',
        newText: '',
        error:false,
        done:false,
    },
    methods:{
        saving: function(){
            let dt = new Date();
            if(!this.newName || !this.newText){
                this.error = true;
                this.done = false;
                setTimeout(() => this.error = false, 3000);
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
                setTimeout(() => this.done = false, 3000);
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
            counting(); 
        }
    }
})

function counting(){
    let count = document.getElementById('show-note').childElementCount;
    let noNotes = document.getElementById('no-notes');
    if(count < 5){
        noNotes.style.display = "block";
    }else{
        noNotes.style.display = "none";
    }
}
setInterval(counting, 1000);


document.addEventListener("DOMContentLoaded", () => {
       fadin('.fade', { delay: 200 })
     });

