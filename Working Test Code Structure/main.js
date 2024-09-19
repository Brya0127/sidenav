// Code rewritten with jquery only and cleaned

$(document).ready(function () {
    console.log("load");
    createSections();
  });
  
  function createSections() {
    // Select all h2 elements
    const headers = $('h2');
    let i = 0;
  
    headers.each(function () {
      // Create a new section element
      const section = $('<section></section>');
  
      // Insert the section before the h2 element
      $(this).before(section);
  
      // Move all the subsequent siblings into the section until we hit another h2 or end of the container
      let next = $(this).next();
      
      while (next.length && next.prop('tagName') !== 'H2') {
        section.append(next);
        next = $(this).next();
      }
  
      // Move the h2 into the section
      section.prepend($(this));
      section.attr('id', 'section-' + i);
      i++;
    });
  
    createSidenav();
  }
  
  function createSidenav() {
    let navOl = $(".list");
  
    // Create dynamic list based on each section (h2)
    $("h2").each(function () {
      // Generate ID
      let listId = $(this).parent().attr("id");
      
      // Create list item with a link pointing to ID
      let listItem = $('<li>').append($('<a>').attr('href', `#${listId}`).attr('tabindex', '0').text($(this).text()));
      navOl.append(listItem);
    });
  
    // Scroll event to highlight the visible section
    $(window).on('scroll', function () {
      markVisibleSection();
    });
  
    // Function to detect the currently visible section
    function markVisibleSection() {
      let currentSection = null;
      
      // Loop through each section to see which is in view
      $('section').each(function () {
        let sectionTop = $(this).offset().top;
        let sectionBottom = sectionTop + $(this).outerHeight();
        let scrollPosition = $(window).scrollTop();
        let windowHeight = $(window).height();
  
        // Check if the section is in view (within the visible window)
        if (sectionTop <= scrollPosition + windowHeight / 2 && sectionBottom >= scrollPosition + windowHeight / 2) {
          currentSection = $(this);
          return false;  // Break loop once we find the visible section
        }
      });
  
      // Clear all previous 'active' classes
      $(".list li").removeClass("active");
      $('h2').removeClass('active');
  
      // Apply 'active' class to the currently visible section's corresponding nav item
      if (currentSection) {
        let id = currentSection.attr('id');
        $(`.list li a[href="#${id}"]`).parent().addClass("active");
        currentSection.find('h2').addClass("active");
      }
    }
  }
  