$(function(){
	'use strict'
	
	const markers = [];
	const addressArray = [];
	var oneMarker, oneAddress;
	
	const remove_image = './images/cancel.svg';
	$('#add-location').prop('disabled', true);
	
	var placesAutocomplete = places({
		appId: 'plYWCXAK5BD2',
		apiKey: '731ae87160db95c5bc9c70e201a8068e',
		container: document.querySelector('#location0')
	});


		
		var latlng = new google.maps.LatLng(37.090240, -95.712891);
		var map = new google.maps.Map(document.getElementById('map'), {
				center: latlng,
				zoom: 5,
				mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		// Set <main> y-axis padding to zero.
		// ***** PLEASE DON'T DELETE THE LINE BELOW, THIS IS FOR STYLING WITHIN THE LARAVEL APP.
		// document.getElementById("main-element").classList.remove("py-4");


		placesAutocomplete.on('change', handleOnChange);
		placesAutocomplete.on('clear', handleOnClear);

		$('#add-location').on('click', function(){
			if(addressArray.length == 0){
				 const tableHeader = '<tr><th>№</th><th>Address name</th></tr>';
				$('.adress-head').append(tableHeader);
			}
			addAdress();
		});	

	
	function handleOnClear() {
		$('#add-location').prop('disabled', true);
		if(oneMarker){
			oneMarker.setMap(null);
			oneMarker = null;
		}
		if(oneAddress){
			oneAddress = null;
		};
		renderAddress();
	}
	
	function handleOnChange(e) {

		const addressName = e.suggestion.name + ', ' + e.suggestion.country;
		const coordinate = e.suggestion.latlng;
		map.panTo(coordinate);
		
		oneAddress = {
			name: addressName,
			coordinate: coordinate,
		}
		
		oneMarker = new google.maps.Marker({
			position: coordinate,
			map: map,
			title: addressName,
			zIndex: 1,
			icon: {
				url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
			}
		});
		$('#add-location').prop('disabled', false);

	}
	
	function addAdress(){
		placesAutocomplete.setVal('');
		if(oneMarker){
			markers.push(oneMarker);
			oneMarker.setMap(null);
			oneMarker = null;
		}
		if(oneAddress){
			addressArray.push(oneAddress);
			oneAddress = null;
		}
		
		$('.address-group').text('');
		$('.adress-input-group').text('');

		var bounds = new google.maps.LatLngBounds();		

		addressArray.forEach(function(item, index){
			markers[index].setMap(map);
			markers[index].setIcon({url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"});

			bounds.extend(markers[index].getPosition());

			const address = '<tr><td class="address-number">'+ (index+1) +'</td><td class="address-name">'+ item.name +'<img onclick="deleteMarker('+ index +')" class="remove_icon" src="'+ remove_image +'"></td></tr>';
			const newInput = '<input name="address'+ index +'" type="hidden" val="'+ item.name +'" />';

			$('.address-group').append(address);
			$('.adress-input-group').append(newInput);
		});

		map.fitBounds(bounds);
		if(addressArray.length == 1){
			setTimeout(function(){map.setZoom(5);	}, 300);
		}
		$('#add-location').prop('disabled', true);
	}
	
	function renderAddress(){
		var bounds = new google.maps.LatLngBounds();		

		addressArray.forEach(function(item, index){
			bounds.extend(markers[index].getPosition());
		});

		map.fitBounds(bounds);
		if(addressArray.length == 1){
			setTimeout(function(){map.setZoom(5);	}, 300);
		}
	}
	
	
		window.deleteMarker = function(id){
			markers.forEach(function(item, index){
				if (index == id) {
					
					markers[index].setMap(null);
					
					addressArray.splice(index,1);
					markers.splice(index,1);
					
					return true
				}
			});
			if(addressArray.length != 0){
				addAdress();
			}
			if(addressArray.length == 1){
				setTimeout(function(){map.setZoom(5);	}, 300);
			}
			if(addressArray.length == 0){
				map.setCenter(latlng);
				$('.address-group').text('');
				$('.adress-head').text('');
			}
		}

})