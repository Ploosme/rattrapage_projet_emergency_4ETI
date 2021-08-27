package Feu.gestion_vehicule.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import Feu.gestion_vehicule.service.dto.VehicleDto;

@Service
public class VehiculeService {

	VehiculeService() {

	}

	public VehicleDto[] getAllVehicules() {
		String allVehiculeUrl = "http://localhost:8080/access/sim/vehicle";
		RestTemplate rescardTemplate = new RestTemplate();
		ResponseEntity<VehicleDto[]> response = rescardTemplate.getForEntity(allVehiculeUrl, VehicleDto[].class);
		VehicleDto[] list = response.getBody();
		return list;
	}

	public VehicleDto getVehicule(Integer id) {
		String VehiculeUrl = "http://localhost:8080/access/sim/vehicle/{id}";
		RestTemplate rescardTemplate = new RestTemplate();
		ResponseEntity<VehicleDto> response = rescardTemplate.getForEntity(VehiculeUrl, VehicleDto.class,id);
		VehicleDto vehicule = response.getBody();
		return vehicule;
	}

	public void save(VehicleDto h) {
		String VehiculeUrl = "http://localhost:8080/access/sim/vehicle/{id}";
		Map<String, Integer> params = new HashMap<String, Integer>();
		params.put("id", h.getId());
		RestTemplate restTemplate = new RestTemplate();
		restTemplate.put(VehiculeUrl, h, params);

	}

	public void delete(VehicleDto h) {
		String VehiculeUrl = "http://localhost:8080/access/sim/vehicle/{id}";
		RestTemplate restTemplate = new RestTemplate();
		String entityUrl = VehiculeUrl + h.getId();
		restTemplate.delete(entityUrl);
	}
}
