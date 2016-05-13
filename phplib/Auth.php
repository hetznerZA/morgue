<?php

class MorgueAuth {

    /**
     * wraper function to call an auth implementation if there is one and
     * return the default user if not
     *
     * @returns auth data as a dictionary
     */
    static function get_auth_data() {
        if (!empty($_SERVER['PHP_AUTH_USER'])) {
            $admin_data =  array("username" => $_SERVER['PHP_AUTH_USER']);
        } else {
            $admin_data = array("username" => "morgue_user");
        }
        return $admin_data;
    }

}
