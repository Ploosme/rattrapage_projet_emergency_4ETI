package Feu.gestion_vehicule.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import org.springframework.web.client.RestTemplate;

import Feu.gestion_vehicule.model.Caserne;
import Feu.gestion_vehicule.model.VehiculeInIntervention;
import Feu.gestion_vehicule.service.CaserneService;
import Feu.gestion_vehicule.service.FireService;
import Feu.gestion_vehicule.service.VehiculeService;
import Feu.gestion_vehicule.service.dto.FireDto;
import Feu.gestion_vehicule.service.dto.VehicleDto;

@Component
public class FireMngrTask {
	@Autowired
	VehiculeService vehiculeService;
	
	@Autowired
	FireService fireService;
	
	@Autowired
	CaserneService caserneservice;

	// fire task management
	@Scheduled(fixedRate = 1000)
	public void manageFire() {
		//first update managed vehicle
		fireService.updateVehicleList();
		fireService.moveVehicule();
		// get all fire with Rest call
		FireDto[] fireList = fireService.getAllFire();
		List<VehiculeInIntervention>  vehiculeInInterList = fireService.getVehiculeInInteventionList();
		boolean fireEnd;
		
		// detect new fire
		for (int i = 0; i < fireList.length; i++) {
			FireDto fire= fireList[i];
			if (!fireService.isFireManaged(fire.getId())) {
				fireService.intervention(fire);
			} 
		}
		
		for (VehiculeInIntervention v : vehiculeInInterList) {
			fireEnd = true;
			for (int i = 0; i < fireList.length; i++) {
				if(v.getFireId()!=null) {
					if(v.getFireId().equals(fireList[i].getId())) {
						fireEnd = false;
					}
				}
			}
			if (fireEnd && (v.getFireId()!=null)) {
				fireService.retourCaserne(v.getVehiculeId());
			}
		}
	}


}
