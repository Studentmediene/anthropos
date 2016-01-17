package com.springapp.mvc.ldap;

import com.springapp.mvc.PersonList;
import com.springapp.mvc.model.Person;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by adrianh on 01.03.15.
 */
@Service
public class LdapUtil {

    LdapTemplate tmpl;
    private static final String host = "ldap://ldapstaging.studentmediene.no:389";
    private static final String name = "dc=studentmediene,dc=no";

    /**
     * TODO: This doesn't work yet for some reason. Find out why some day. In the meantime, use the manual creation of tmpl, a temporary ldapTemplate.
     */
    @Autowired
    LdapTemplate ldapTemplate;

    public LdapUtil() {
        LdapContextSource ctxSrc = new LdapContextSource();
        ctxSrc.setUrl(host);
        ctxSrc.setBase(name);
        ctxSrc.setUserDn("");
        ctxSrc.setPassword("");

        ctxSrc.afterPropertiesSet();

        this.tmpl = new LdapTemplate(ctxSrc);
    }

    Logger logger = LoggerFactory.getLogger(getClass());

    public PersonList getUsers() {
        final int[] activeCount = {0};
        PersonList personList = new PersonList();
        logger.info("ldapTemplate context source: " + tmpl.getContextSource());
            List<Person> persons = tmpl.search("ou=Users", "(objectClass=person)", new PersonAttributesMapper());

        logger.info("Number of users from LDAP: {}", persons.size());
        logger.info("Number of active: {}", activeCount[0]);

        personList.update(persons);
        return personList;
    }

    public Person getUser(String dn) {
        return tmpl.lookup(dn, new PersonAttributesMapper());
    }
}

