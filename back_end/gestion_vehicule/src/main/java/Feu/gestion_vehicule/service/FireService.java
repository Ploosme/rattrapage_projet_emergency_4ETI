package Feu.gestion_vehicule.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import Feu.gestion_vehicule.model.Caserne;
import Feu.gestion_vehicule.model.VehiculeInIntervention;
import Feu.gestion_vehicule.model.VehiculeInIntervention.Coord;
import Feu.gestion_vehicule.service.dto.FireDto;
import Feu.gestion_vehicule.service.dto.FireTypeDto;
import Feu.gestion_vehicule.service.dto.VehicleDto;
import Feu.gestion_vehicule.service.dto.indexRouteDto;
import Feu.gestion_vehicule.service.dto.routeDto;

@Service
public class FireService {

	List<VehiculeInIntervention> vehiculeList = new ArrayList<VehiculeInIntervention>();

	@Autowired
	VehiculeService vehiculeservice;

	@Autowired
	CaserneService caserneService;

	FireService() {
	}
	public void moveVehicule() {
		//récuperation liste vehicule a bouger
		for (VehiculeInIntervention v : this.vehiculeList) {
			if(v.isInMove()) {
				VehicleDto vehicule=this.vehiculeservice.getVehicule(v.getVehiculeId());
				Coord coordFinal=v.nextMove();
				vehicule.setLat(coordFinal.lat);
				vehicule.setLon(coordFinal.lon);
				this.vehiculeservice.save(vehicule);
				
			}
				
		}
	}
	public void updateVehicleList() {
		VehicleDto[] vehiculeList = vehiculeservice.getAllVehicules();
		List<VehiculeInIntervention> foundVehicle = new ArrayList<VehiculeInIntervention>();
		// detect new vehicle and deleted one
		for (int i = 0; i < vehiculeList.length; i++) {
			VehicleDto v = vehiculeList[i];
			VehiculeInIntervention foundVi = null;
			for (VehiculeInIntervention vi : this.vehiculeList) {
				if (vi.getVehiculeId().equals(v.getId())) {
					foundVi = vi;
					break;
				}
			}

			if (foundVi != null) {
				foundVehicle.add(foundVi);
			} else {
				// new vehicle get a caserne.
				Caserne c = this.getCaserneproche(v.getLon(), v.getLat());
				System.out.println(c);
				if (c != null) {
					vehiculeservice.save(v);
					VehiculeInIntervention vi = new VehiculeInIntervention();
					vi.setVehiculeId(v.getId());
					vi.setCaserneId(c.getId());
					foundVehicle.add(vi);
					this.vehiculeList = foundVehicle;
					this.retourCaserne(v.getId());
					
				}
			}
		}

		this.vehiculeList = foundVehicle;
	}

	public FireDto[] getAllFire() {
		String allfireurl = "http://localhost:8080/access/sim/fire";
		RestTemplate rescardTemplate = new RestTemplate();
		ResponseEntity<FireDto[]> response = rescardTemplate.getForEntity(allfireurl, FireDto[].class);
		FireDto[] list = response.getBody();
		return list;
	}

	public List<VehiculeInIntervention> getVehiculeInInteventionList() {
		return this.vehiculeList;
	}
	
	
	public boolean isFireManaged(Integer fireId) {
		for (VehiculeInIntervention v : this.vehiculeList) {
			if (v.getFireId() != null && v.getFireId().equals(fireId)) {
				return true;
			}
		}
		return false;
	}
	
	public ArrayList<ArrayList> getNavigationId(Integer viId) {
		for (VehiculeInIntervention vi : this.vehiculeList) {
			if (vi.getVehiculeId().equals(viId)) {
				return vi.getNavigation();
				}
		}
		return null;
	}
	
	
	public void retourCaserne(Integer retviId) {
		for (VehiculeInIntervention vi : this.vehiculeList) {
			System.out.println("oui");
			if (vi.getVehiculeId().equals(retviId)) {
				vi.returnToCasern();
				Caserne caserne = caserneService.getCaserne(vi.getCaserneId());
				VehicleDto vehicule = vehiculeservice.getVehicule(vi.getVehiculeId());
				if (caserne != null && vehicule != null) {
					
				// update in simulator
					vi.setMove(getNavigation(vehicule.getLon(),vehicule.getLat(),caserne.getLon(),caserne.getLat()));
					vehicule.setFuel(50);
					vehicule.setLiquidQuantity(50);
					vehiculeservice.save(vehicule);
				}
				break;
			}
		}
	}

	public void intervention(FireDto fire) {
		VehicleDto vehicule = this.getVehicleForIntervention(fire);
		if (vehicule != null) {
			//update service vehicle state
			for (VehiculeInIntervention vi : this.vehiculeList) {
				if (vi.getVehiculeId().equals(vehicule.getId())) {
					vi.affectFire(fire.getId());
					vi.setMove(getNavigation(vehicule.getLon(),vehicule.getLat(),fire.getLon(),fire.getLat()));
					break;
				}
			}
			vehiculeservice.save(vehicule);
		}
	}

	private VehicleDto getVehicleForIntervention(FireDto fire) {
		// get a caserne
		Caserne caserne = getCaserneproche(fire.getLon(), fire.getLat());
		
		if (caserne != null) {
			// get all caserne vehicule.
			List<VehiculeInIntervention> listVehic = this.getVehiculeInCaserne(caserne.getId());
			// get a vehicule that isn't in intervention.
			for (VehiculeInIntervention vi : listVehic) {
				if (!vi.isInIntervention()) {
					VehicleDto vehicule = vehiculeservice.getVehicule(vi.getVehiculeId());
					if (vehicule.getLiquidQuantity() >= 0 && vehicule.getFuel() >= 0) {
						return vehicule;
					}
				}
			}
		}
		return null;
	}

	private Caserne getCaserneproche(double lon, double lat) {
		List<Caserne> caserneList = caserneService.getAllCaserne();
		if (caserneList.size() > 0) {
			Caserne caserneProche = caserneList.get(0);
			double distance = Math.sqrt((caserneProche.getLon()-lon)*(caserneProche.getLon()-lon)+(caserneProche.getLat()-lat)*(caserneProche.getLat()-lat));
			for (Caserne caserne : caserneList) {
				if ((Math.sqrt((caserne.getLon()-lon)*(caserne.getLon()-lon)+(caserne.getLat()-lat)*(caserne.getLat()-lat)))<distance) {
					caserneProche = caserne;
					distance = (Math.sqrt((caserne.getLon()-lon)*(caserne.getLon()-lon)+(caserne.getLat()-lat)*(caserne.getLat()-lat)));
				}
			}
			return caserneProche;
		}

		return null;
	}

	private List<VehiculeInIntervention> getVehiculeInCaserne(Integer caserneId) {
		List<VehiculeInIntervention> vehicleInCaserneList = new ArrayList<VehiculeInIntervention>();
		for (VehiculeInIntervention vi : this.vehiculeList) {
			if (vi.getCaserneId().equals(caserneId)) {
				vehicleInCaserneList.add(vi);
			}
		}
		return vehicleInCaserneList;
	}

	
	private ArrayList<ArrayList> getNavigation(double lonInitial, double latInitial, double lonFinal, double latFinal) {
		
		String urlNavigation = "https://api.mapbox.com/directions/v5/mapbox/driving/"+lonInitial+","+latInitial+";"+lonFinal+","+latFinal+"?alternatives=true&geometries=geojson&overview=full&steps=false&access_token=pk.eyJ1Ijoib2JzY3VycnJycnIiLCJhIjoiY2tzbHR5eHp2MTBqdzJ3cW92bW1xbjRvYiJ9.lT-Rlmu3R_bearNunhGlsQ";
		RestTemplate moveTemplate = new RestTemplate();
		System.out.println(urlNavigation);
		ResponseEntity<routeDto> response = moveTemplate.getForEntity(urlNavigation, routeDto.class);
		routeDto route = response.getBody();
		if (!route.getRoutes().isEmpty()) {
			Map<String,Object> info = (Map<String, Object>) route.getRoutes().get(0);
			Map<String,Object> direction =  (Map<String, Object>) info.get("geometry");
			ArrayList<ArrayList> navigation = (ArrayList) direction.get("coordinates");
			ArrayList<Object> arrayInit = new ArrayList();
			arrayInit.add(lonInitial);
			arrayInit.add(latInitial);
			ArrayList<Object> arrayFinal = new ArrayList();
			arrayFinal.add(lonFinal);
			arrayFinal.add(latFinal);
			navigation.add(0,arrayInit );
			navigation.add(arrayFinal);
			return navigation;
		}
		else {
			return null;
		}
	}
}