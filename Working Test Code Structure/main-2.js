// // // Create a new <p> element
// // const paragraph = document.createElement('p');

// // // Set the text content of the <p> element
// // paragraph.textContent = 'Hi Gay!';

// // // Append the <p> element to the body
// // document.body.appendChild(paragraph);

// var dynaList = [];
// let navOl = $(".list");


// $(".text").find("h3").each(function() {
//   dynaList.push($(this).text());
// });

// // Create <li> elements for each heading and add them to the <ol>
// dynaList.forEach(function(item) {
//   // Generate ID 
//   let headingId = item.replace(/\s+/g, '-').toLowerCase();
//   // Create list item with a link pointing to ID
// //   tab index class for accessability. Is it fine they're all 0, or should it go 0 1 2 3 4, etc?
//   let listItem = $('<li>').append($('<a>').attr('href', `#${headingId}`).attr('tab-index', '0').text(item));
//   navOl.append(listItem);
// });


// $(".text h3").each(function() {
//   let headingText = $(this).text();
//   let headingId = headingText.replace(/\s+/g, '-').toLowerCase();
// //    /\s+/g, '-'
//   $(this).attr('id', headingId);
// });

// const viewportHeight = window.innerHeight;



// // Calculate the top 10% of the viewport
// const top10Percent = viewportHeight * 0.1;

// // Event listener for heading reaching viewport.  
// let observer = new IntersectionObserver(function(entries) {
//   entries.forEach(function(entry) {
//     let targetId = $(entry.target).attr("id");
//     let navLink = $(`.list a[href="#${targetId}"]`);
    
//     // New code to make sure it only applies to one at a time
//     $(".text h3").removeClass("active");
//     $(".list li").removeClass("active");
//     // Original code
//     if (entry.isIntersecting) {
//       $(entry.target).addClass("active");
//       navLink.parent().addClass("active");
//     } else {
//       $(entry.target).removeClass("active");
//       navLink.parent().removeClass("active");
//     }
//   });
// }, {
//   root: null, // Use the viewport as the root
//   rootMargin: `-${viewportHeight - top10Percent}px 0px 0px 0px`,// Trigger when the element enters the top 10%
//   threshold: 0.6,
// });


// $(".text h3").each(function() {
//   observer.observe(this);
// });

// Curently addressed concerns except mobile friendly, but skip links and keyboard nav accessability should work

document.addEventListener('DOMContentLoaded', function () {
  console.log("load");
  createSections();
  

});

function createSections(){
  // Select all h2 elements
  const headers = document.querySelectorAll('h2');
  let i = 0;
  headers.forEach(header => {
      // Create a new section element
      const section = document.createElement('section');

      // Insert the section before the h2 element
      header.parentNode.insertBefore(section, header);

      

      // Move all the subsequent siblings into the section until we hit another h2 or end of the container
      let next = header.nextElementSibling;
      
      while (next && next.tagName !== 'H2') {
      
          section.appendChild(next);
          next = header.nextElementSibling;
      }
    // Move the h2 into the section
      section.prepend(header);
      section.id = "section-"+i;
      i++;
  });
  createSidenav();
  
}
function createSidenav(){

var dynaList = [];
let navOl = $(".list");


$("h2").each(function() {
// Generate ID 
let listId = $(this).parent().attr("id");
// Create list item with a link pointing to ID
//   tab index class for accessability. Is it fine they're all 0, or should it go 0 1 2 3 4, etc?
let listItem = $('<li>').append($('<a>').attr('href', `#${listId}`).attr('tab-index', '0').text($(this).text()));
navOl.append(listItem);
});



// function markVisibleSection(observedEls) {

// observedEls.forEach(observedEl => {
  
//   const id = observedEl.target.getAttribute('id'),
//       anchor = document.querySelector(`.list li a[href="#${ id }"]`);
  
//   if(!anchor)
//     return false
  
//   const listItem = anchor.parentElement;

//   if (observedEl.isIntersecting) {
//     listItem.classList.add("active");
//   } else {
//     listItem.classList.remove("active");
//   }

// })
// }
// const options = {
//   threshold:0.05
// }
// const elementsToObserve = document.querySelectorAll('.text section');
// const observer = new IntersectionObserver(markVisibleSection, options);
// elementsToObserve.forEach(thisEl => observer.observe(thisEl));
  

// }
  // IntersectionObserver logic to detect visible section and highlight its nav item
  function markVisibleSection(observedEls) {
    let currentActiveItem = null;

    observedEls.forEach(observedEl => {
      const id = observedEl.target.getAttribute('id');
      const anchor = document.querySelector(`.list li a[href="#${id}"]`);
      const listItem = anchor ? anchor.parentElement : null;

      // If a section is intersecting and has more than a certain threshold visible
      if (observedEl.isIntersecting && observedEl.intersectionRatio >= 0.5) {
        currentActiveItem = listItem;
      }
    });

    // Clear previous active states
    $(".list li").removeClass("active");
    $(".text h3").removeClass("active");

    // Set active state for the currently visible section
    if (currentActiveItem) {
      currentActiveItem.classList.add("active");
    }
  }

  const observerOptions = {
    threshold: [0.5],  // Set threshold to trigger when 50% of the section is visible
  };

  const elementsToObserve = document.querySelectorAll('.text section');
  const observer = new IntersectionObserver(markVisibleSection, observerOptions);

  // Start observing each section
  elementsToObserve.forEach(section => observer.observe(section));
}
