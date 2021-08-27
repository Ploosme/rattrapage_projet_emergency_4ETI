package Feu.gestion_vehicule.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import Feu.gestion_vehicule.service.CaserneService;
import Feu.gestion_vehicule.service.FireService;
import Feu.gestion_vehicule.model.Caserne;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
public class CaserneController {

	@Autowired
	CaserneService caserneService;
	
	@Autowired
	FireService fireService;
	
	@CrossOrigin
	@RequestMapping(method = RequestMethod.GET, value = "/caserne/{id}")
	public Caserne getCaserne(@PathVariable Integer id) {
		Caserne h = caserneService.getCaserne(id);
		return h;
	}
	@CrossOrigin
	@RequestMapping(method = RequestMethod.GET, value = "/caserne")
	public List<Caserne> getAllCaserne() {
		List<Caserne> caserneList = caserneService.getAllCaserne();
		return caserneList;
	}
	
	@CrossOrigin
	@RequestMapping(method = RequestMethod.GET, value = "/navigation/vehicle/{id}")
	public List<ArrayList> getNavigation(@PathVariable Integer id) {
		List<ArrayList> navigation = fireService.getNavigationId(id);
		return navigation;
	}
	

}