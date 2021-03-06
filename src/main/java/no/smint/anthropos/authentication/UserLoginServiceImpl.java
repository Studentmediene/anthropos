/*
 * Copyright 2016 Studentmediene i Trondheim AS
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package no.smint.anthropos.authentication;

import no.smint.anthropos.model.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class UserLoginServiceImpl implements UserLoginService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public int getId() {
        return getLoggedInUserDetails().getUidNumber();
    }

    @Override
    public String getUsername() {
        return getLoggedInUserDetails().getUsername();
    }

    @Override
    public boolean login(LdapUserPwd token) {
        Authentication authentication = authenticationManager.authenticate(new Token(token));
        boolean isAuthenticated = isAuthenticated(authentication);
        if (isAuthenticated) {
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        return isAuthenticated;
    }

    @Override
    public void logout() {
        SecurityContextHolder.getContext().setAuthentication(null);
    }

    @Override
    public Person getLoggedInUser() {
        return null;
    }

    public AuthUserDetails getLoggedInUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (isAuthenticated(authentication)) {
            return (AuthUserDetails) authentication.getPrincipal();
        }
        return null;
    }

    private boolean isAuthenticated(Authentication authentication) {
        return authentication != null && !(authentication instanceof AnonymousAuthenticationToken) && authentication.isAuthenticated();
    }
}
