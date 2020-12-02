
function loadPage() {
    $(function (){
        var star = '.star',
            selected = '.selected';
        
        $(star).on('click', function(){
          $(selected).each(function(){
            $(this).removeClass('selected');
          });
          $(this).addClass('selected');
        });
       
      });
      
      document.querySelector("#estrella").addEventListener('click', votar);
      document.querySelector("#voto").addEventListener('click', votar);
      function votar() {

         document.querySelector("#popvoto").classList.toggle("d-none");
      }
    
      document.querySelector("#dropdown-user").addEventListener('click', showDropdown);

      function showDropdown() {
    
        document.querySelector("#drop-content").classList.toggle("d-none");
     }
    
  }document.addEventListener("DOMContentLoaded", loadPage);